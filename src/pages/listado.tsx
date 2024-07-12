import { Card, CardBody, Image, Link } from "@nextui-org/react";
import { FetchError } from "ofetch";
import useSWR from "swr";
import { Producto } from "../types";

export const Listado = () => {
  const { data } = useSWR<Producto[], FetchError>("productos");

  console.log(data);

  return (
    <main className="prose mx-auto max-sm:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {data?.map((item) => (
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
  );
};
