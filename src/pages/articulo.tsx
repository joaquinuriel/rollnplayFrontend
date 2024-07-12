import { Button, Image, Input, Spacer } from "@nextui-org/react";
import { FetchError } from "ofetch";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fetcher } from "../config";
import { Item, Producto, Usuario } from "../types";

export const Articulo = () => {
  const { id } = useParams<{ id: string }>();

  const [cookie] = document.cookie.split(";");
  const [, token] = cookie.split("=");

  const [cantidad, setCantidad] = useState(1);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [stock, setStock] = useState(0);

  const { data } = useSWR<Producto, FetchError>(`productos/${id}`, null, {
    onSuccess(data) {
      setNombre(data.nombre);
      setDescripcion(data.descripcion);
      setPrecio(data.precio);
      setStock(data.stock);
    },
  });

  const { data: user } = useSWR<Usuario>("auth", () => {
    return fetcher("auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  const { data: items, mutate: refreshItems } = useSWR<Item[]>(
    user ? `carrito/${user.carrito.id}/items` : null
  );

  console.log({ user, items });

  const enCarrito = useMemo(() => {
    return items?.some((item) => item.producto.id === data?.id);
  }, [data, items]);

  const { trigger: carrito, isMutating: agregando } = useSWRMutation(
    user ? `carrito/${user.carrito.id}` : null,
    (key: string) => {
      return fetcher(key, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: data,
        params: { cantidad },
      });
    },
    {
      onSuccess() {
        alert("Agregados " + cantidad + " productos");
        refreshItems();
      },
    }
  );

  const { trigger: guardar, isMutating: guardando } = useSWRMutation(
    "productos",
    (key) => {
      return fetcher(key, {
        headers: { Authorization: `Bearer ${token}` },
        method: "PUT",
        body: {
          id,
          nombre,
          descripcion,
          precio,
          stock,
          imageUrl: data?.imageUrl,
          categoria: data?.categoria,
          vendedor: data?.vendedor,
          // image_url: data?.image_url,
        },
      });
    }
  );

  const valid = data ? cantidad > 0 && cantidad <= data.stock : false;
  const vende = user ? user.productos.some((p) => p.id === data?.id) : false;

  console.log("data", data, "user", user);

  if (!data) {
    return (
      <main className="px-4">
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="p-4 prose mx-auto flex flex-wrap">
      <div className="flex-1">
        <Image src={data.imageUrl} alt="" />
      </div>
      <div className="flex-1" hidden={vende}>
        <h1>{data.nombre}</h1>
        <p>{data.descripcion}</p>
        <p>$ {data.precio}</p>
        <p>{data.stock} unidades</p>
        <Input
          type="number"
          placeholder="Cantidad"
          min={1}
          step={1}
          max={data.stock}
          isInvalid={!valid || !user}
          isDisabled={agregando}
          value={cantidad + ""}
          onChange={(e) => setCantidad(e.target.valueAsNumber)}
        />
        <Spacer />
        <Button
          color="primary"
          fullWidth
          isDisabled={!valid || !user || enCarrito}
          isLoading={agregando}
          onClick={() => carrito()}
        >
          {enCarrito ? "En el carrito" : "Añadir al carrito"}
        </Button>
      </div>

      <div hidden={!vende}>
        <Input
          label="Nombre"
          placeholder={data.nombre}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <Input
          label="Descripcion"
          placeholder={data.descripcion}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <Input
          type="number"
          label="Precio"
          placeholder={data.precio + ""}
          value={precio + ""}
          onChange={(e) => setPrecio(e.target.valueAsNumber)}
        />
        <Input
          type="number"
          label="Stock"
          placeholder={data.stock + ""}
          value={stock + ""}
          onChange={(e) => setStock(e.target.valueAsNumber)}
        />
        <Button
          color="primary"
          fullWidth
          isLoading={guardando}
          onClick={() => guardar()}
        >
          Actualizar
        </Button>
      </div>
    </main>
  );
};
