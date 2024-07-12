import { Button, Input, Select, SelectItem, Spacer } from "@nextui-org/react";
import { FetchError } from "ofetch";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fetcher } from "../config";
import { Categoria } from "../types";

export const Publicar = () => {
  const [cookie] = document.cookie.split(";");
  const [, token] = cookie.split("=");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [image_url, setImageURL] = useState("");

  const navigate = useNavigate();

  const { data: cats, isLoading: catsCargando } = useSWR<Categoria[]>(
    "productos/categorias"
  );

  const { data: user, isLoading } = useSWR("auth", (key) => {
    return fetcher(key, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  console.log({ user, cats });

  const { trigger } = useSWRMutation<unknown, FetchError, string, FormEvent>(
    "productos",
    (key, { arg }) => {
      arg.preventDefault();
      return fetcher(key, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          nombre,
          descripcion,
          categoria: { id: categoria },
          precio,
          stock,
          image_url,
        },
      });
    },
    {
      onSuccess() {
        alert("Publicacion exitosa");
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setStock("");
        setCategoria("");
        setImageURL("");
      },
    }
  );

  if (!isLoading && !user) {
    confirm("Debes iniciar sesion para publicar");
    navigate("/login");
  }

  return (
    <main className="prose mx-auto max-sm:px-8">
      <form onSubmit={trigger}>
        <h1>Publicar</h1>
        <Input
          label="Nombre"
          isRequired
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <Spacer y={2} />
        <Input
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <Spacer y={2} />
        {/* <Input
          label="Categoría"
          isRequired
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        /> */}
        <Select
          label="Categoría"
          isLoading={catsCargando}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          {cats ? (
            cats.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </SelectItem>
            ))
          ) : (
            <SelectItem key="cat" />
          )}
        </Select>
        <Spacer y={2} />
        <Input
          type="number"
          label="Precio"
          startContent="$"
          endContent="pesos"
          isRequired
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <Spacer y={2} />
        <Input
          label="Stock"
          endContent="unidades"
          isRequired
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <Spacer y={2} />
        <Input
          label="URL Imagen"
          isRequired
          value={image_url}
          onChange={(e) => setImageURL(e.target.value)}
        />
        <Spacer y={2} />
        <Button type="submit" color="primary" fullWidth>
          Publicar
        </Button>
      </form>
    </main>
  );
};
