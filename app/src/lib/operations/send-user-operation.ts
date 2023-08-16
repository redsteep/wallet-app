import { Client, type IUserOperationBuilder } from "userop";
import { BUNDLER_URL, ENTRYPOINT_ADDRESS } from "~/lib/env-variables";

export async function sendAndWaitUserOperation(
  builder: IUserOperationBuilder | Promise<IUserOperationBuilder>,
) {
  const client = await Client.init(BUNDLER_URL, { entryPoint: ENTRYPOINT_ADDRESS });
  const res = await client.sendUserOperation(await builder);
  return await res.wait();
}
