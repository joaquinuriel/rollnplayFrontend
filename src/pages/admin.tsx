import useSWR from "swr";
import { fetcher } from "../config";
import { Usuario } from "../types";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation";

export const Admin = () => {
  const [cookie] = document.cookie.split(";");
  const [, token] = cookie.split("=");

  const { data: user } = useSWR(`auth:${token}`, () => {
    return fetcher<Usuario>("auth", {
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  const { data: users = [], mutate } = useSWR("usuarios", () => {
    return fetcher<Usuario[]>("usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  console.log(typeof users, users instanceof Array);
  console.log({ user, users });

  const { trigger, isMutating } = useSWRMutation(
    "promover",
    (_, { arg: id }) => {
      return fetcher(`usuarios/promover`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        params: { id },
      });
    },
    { onSuccess: () => mutate() }
  ) as SWRMutationResponse<void, void, string, number>;

  if (!user || user.rol !== "ADMIN") return null;

  return (
    <Table removeWrapper>
      <TableHeader>
        <TableColumn>Usuario</TableColumn>
        <TableColumn>Rol</TableColumn>
        <TableColumn>Promover a vendedor</TableColumn>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              {user.nombre} {user.apellido}
            </TableCell>
            <TableCell>{user.rol}</TableCell>
            <TableCell>
              <Button
                isDisabled={user.rol !== "USER"}
                isLoading={isMutating}
                onClick={() => trigger(user.id)}
              >
                Promover
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
