import {
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Link,
  Select,
  SelectItem,
} from "@nextui-org/react";
import useSWR from "swr";
import { Categoria, Producto } from "../types";
import { useState } from "react";
import { FetchError } from "ofetch";
import { fetcher } from "../config";

export const Home = () => {
  const [categoriaId, setCategoria] = useState("");
  const [precioMaximo, setMaximo] = useState(0);

  const { data: productos, mutate } = useSWR<Producto[], FetchError>(
    "productos",
    (key: string) => {
      return fetcher(key, {
        params: {
          categoriaId,
          precioMaximo,
        },
      });
    }
  );

  const { data: cats = [], isLoading: catsCargando } = useSWR<Categoria[]>(
    "productos/categorias"
  );

  console.log({ productos, cats });

  return (
    <div className="flex flex-wrap gap-4 px-8 mx-auto">
      <aside className="flex gap-2 flex-col">
        <Select
          label="Categoría"
          value={categoriaId}
          onChange={(e) => setCategoria(e.target.value)}
          items={cats}
          isLoading={catsCargando}
        >
          {(item) => <SelectItem key={item.id}>{item.nombre}</SelectItem>}
        </Select>

        <Input
          type="number"
          label="Máximo"
          endContent="pesos"
          value={precioMaximo + ""}
          onChange={(e) => setMaximo(e.target.valueAsNumber || 0)}
        />
        <Button onClick={() => mutate()}>Buscar</Button>
      </aside>
      <main className="prose">
        <h1>Roll'n'Play</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {productos?.map((item) => (
            <Link key={item.id} href={"/listado/" + item.id}>
              <Card>
                <CardBody className="prose">
                  <Image src={item.imageUrl} alt="" width={300} />
                  <h3>{item.nombre}</h3>
                  <p>$ {item.precio}</p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};
