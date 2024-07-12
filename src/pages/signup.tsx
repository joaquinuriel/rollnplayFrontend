import { Button, Input, Link, Spacer } from "@nextui-org/react";
import { FetchError } from "ofetch";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { fetcher } from "../config";

export const SignUp = () => {
  const [correo, setEmail] = useState("");
  const [contraseña, setPassword] = useState("");
  const [nombre, setFirstName] = useState("");
  const [apellido, setLastName] = useState("");
  const navigate = useNavigate();

  const { trigger, isMutating } = useSWRMutation<
    string,
    FetchError,
    string,
    FormEvent
  >(
    "usuarios/registro",
    (key, { arg }) => {
      arg.preventDefault();
      return fetcher(key, {
        method: "POST",
        body: {
          correo,
          contraseña,
          nombre,
          apellido,
        },
      });
    },
    {
      onSuccess(token) {
        document.cookie = `token=${token}`;
        mutate(`auth:${token}`).then(() => {
          navigate("/perfil");
        });
      },
    }
  );

  return (
    <main className="flex fixed inset-0 top-16">
      <form className="prose m-auto" onSubmit={trigger}>
        <h1>Sign Up</h1>
        <Input
          type="email"
          label="email"
          autoComplete="email"
          // labelPlacement="outside"
          fullWidth
          value={correo}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Spacer y={2} />
        <Input
          type="password"
          label="password"
          autoComplete="new-password"
          // labelPlacement="outside"
          fullWidth
          value={contraseña}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Spacer y={2} />
        <div className="flex">
          <Input
            label="nombre"
            autoComplete="given-name"
            // labelPlacement="outside"
            fullWidth
            value={nombre}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Spacer x={2} />
          <Input
            label="apellido"
            autoComplete="family-name"
            // labelPlacement="outside"
            fullWidth
            value={apellido}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <Spacer y={2} />
        <Button
          type="submit"
          color="primary"
          fullWidth
          isDisabled={isMutating}
          isLoading={isMutating}
        >
          Crear cuenta
        </Button>
        <Spacer y={2} />
        <Button as={Link} href="/login" fullWidth variant="light">
          Iniciar Sesión
        </Button>
      </form>
    </main>
  );
};
