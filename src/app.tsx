import { TrashIcon } from "@heroicons/react/16/solid";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fetcher } from "./config";
import { Articulo } from "./pages/articulo";
import { Home } from "./pages/home";
import { Listado } from "./pages/listado";
import { Login } from "./pages/login";
import { Perfil } from "./pages/perfil";
import { Publicar } from "./pages/publicar";
import { SignUp } from "./pages/signup";
import { Carrito, Item, Usuario } from "./types";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/listado",
    element: <Listado />,
  },
  {
    path: "/listado/:id",
    element: <Articulo />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/perfil",
    element: <Perfil />,
  },
  {
    path: "/publicar",
    element: <Publicar />,
  },
]);

function App() {
  const [cookie] = document.cookie.split(";");
  const [, token] = cookie.split("=");
  // const [menu, setMenu] = useState("");

  const { data: user } = useSWR<Usuario>(`auth:${token}`, () => {
    return fetcher("auth", {
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  const { data: carrito } = useSWR<Carrito>(
    user ? `carrito/${user.carrito.id}` : null
  );

  const { data: items, mutate } = useSWR<Item[]>(
    user ? `carrito/${user.carrito.id}/items` : null
  );

  console.log({ user, carrito, items });

  const total = useMemo(() => {
    return (
      items?.reduce((acc, item) => {
        return acc + item.producto.precio * item.cantidad;
      }, 0) ?? 0
    );
  }, [items]);

  const { trigger, isMutating } = useSWRMutation(
    carrito ? "checkout/" + carrito.id : null,
    (key) => {
      return fetcher(key, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess() {
        mutate();
        alert("Compra realizada con exito");
      },
    }
  );

  const { trigger: eliminar } = useSWRMutation<
    unknown,
    Error,
    string | null,
    number
  >(
    carrito ? "carrito/" + carrito.id : null,
    (key, { arg: itemId }) => {
      return fetcher(key, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        params: { itemId },
      });
    },
    {
      onSuccess() {
        mutate();
      },
    }
  );

  return (
    <div className="">
      <Navbar>
        <NavbarBrand className="prose">
          <Link href="/" color="foreground">
            RollNPlay
          </Link>
        </NavbarBrand>
        <NavbarContent justify="center">
          <NavbarItem>
            <Link href="/listado">Listado</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/publicar">Publicar</Link>
          </NavbarItem>
        </NavbarContent>

        {/* <NavbarMenu hidden={menu !== "favoritos"}>
          <NavbarMenuItem>Favoritos</NavbarMenuItem>
        </NavbarMenu> */}

        <NavbarMenu
        // hidden={menu !== "carrito"}
        >
          <NavbarMenuItem>Carrito</NavbarMenuItem>
          {items?.map((item) => (
            <NavbarMenuItem
              key={item.id}
              className="flex items-center justify-between"
            >
              <span>
                {item.producto.nombre} {item.cantidad}*{item.producto.precio}
              </span>
              <Button
                color="danger"
                variant="flat"
                size="sm"
                isIconOnly
                onClick={() => eliminar(item.id)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            Subtotal {Number(total).toLocaleString("es-AR")}
          </NavbarMenuItem>
          <Button
            onClick={() => trigger()}
            isLoading={isMutating}
            isDisabled={isMutating}
          >
            Pagar
          </Button>
        </NavbarMenu>

        <NavbarContent justify="end">
          {/* <NavbarMenuToggle
            icon={<HeartIcon />}
            onChange={(selected) => setMenu(selected ? "favoritos" : "")}
          /> */}
          <NavbarMenuToggle
            icon={<ShoppingBagIcon />}
            // onChange={(selected) => setMenu(selected ? "carrito" : "")}
          />
          <NavbarItem>
            <Button as={Link} href="/login" hidden={!!user}>
              Iniciar Sesión
            </Button>
            <Link href="/perfil" hidden={!user}>
              <Avatar name={user?.nombre} />
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <RouterProvider router={router} />
      <footer></footer>
    </div>
  );
}

export default App;
