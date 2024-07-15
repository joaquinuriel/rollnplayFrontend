import { Button, Input, Spacer } from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fetcher } from "../config";
import { Usuario } from "../types";
import { Admin } from "./admin";

export const Perfil = () => {
  const navigate = useNavigate();
  const [cookie] = document.cookie.split(";");
  const [, token] = cookie.split("=");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  console.log({ access_token: token });
  const { data, mutate } = useSWR(
    `auth:${token}`,
    () => {
      return fetcher<Usuario>("auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    {
      onSuccess(data) {
        console.log({ data });
        if (!data) navigate("/login");
        setNombre(data.nombre);
        setApellido(data.apellido);
      },
      onError: () => navigate("/login"),
    }
  );

  const { trigger: actualizar, isMutating: actualizando } = useSWRMutation(
    data ? `usuarios` : null,
    (key) => {
      return fetcher(key, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { id: data?.id, nombre, apellido },
        method: "PUT",
      });
    },
    {
      onSuccess() {
        mutate();
      },
    }
  );

  const signOut = () => {
    document.cookie = "token=;";
    navigate("/login");
    mutate();
  };

  return (
    <main className="prose max-sm:px-8 mx-auto">
      <h1>Perfil</h1>
      <div hidden={!!data}>
        <p>Cargando</p>
      </div>
      <div hidden={!data}>
        <p>
          Hola {data?.nombre} {data?.apellido}
        </p>

        <Input
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <Input
          label="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
        <Spacer />
        <Button
          color="primary"
          fullWidth
          isLoading={actualizando}
          isDisabled={actualizando}
          onClick={() => actualizar()}
        >
          Guardar
        </Button>
        <Spacer />
        <Button color="danger" fullWidth onClick={signOut}>
          Cerrar sesión
        </Button>
      </div>

      <Admin />
    </main>
  );
};
