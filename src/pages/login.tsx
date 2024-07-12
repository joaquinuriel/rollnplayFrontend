import { Button, Input, Link, Spacer } from "@nextui-org/react";
import { FetchError } from "ofetch";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { fetcher } from "../config";

export const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();

  const { trigger, isMutating } = useSWRMutation<
    string,
    FetchError,
    string,
    FormEvent
  >(
    "auth/login",
    (key, { arg }) => {
      arg.preventDefault();
      return fetcher(key, {
        method: "POST",
        body: { correo, contraseña },
      });
    },
    {
      onSuccess(token) {
        console.log({ token });
        document.cookie = `token=${token}`;
        mutate(`auth:${token}`).then(() => {
          navigate("/perfil");
        });
      },
    }
  );

  return (
    <main className="flex fixed inset-0">
      <form className="m-auto prose min-w-64" onSubmit={trigger}>
        <h1>Login</h1>
        <Spacer y={2} />
        <Input
          type="email"
          label="email"
          autoComplete="email"
          // labelPlacement="outside"
          fullWidth
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <Spacer y={2} />
        <Input
          type="password"
          label="password"
          autoComplete="current-password"
          // labelPlacement="outside"
          fullWidth
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />
        <Spacer y={2} />
        <Button
          type="submit"
          color="primary"
          fullWidth
          isDisabled={isMutating}
          isLoading={isMutating}
        >
          Iniciar Sesión
        </Button>
        <Spacer y={2} />
        <Button as={Link} href="/signup" fullWidth variant="light">
          Crear cuenta
        </Button>
      </form>
    </main>
  );
};
