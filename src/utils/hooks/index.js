import shell from "shelljs";
import osName from "os-name";

export function getConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export function clear() {
  console.log("Removendo diretórios temporários...");

  const system = osName();
  const separator = system.includes("Windows") ? "\\" : "/";

  const pathDirectoryList = shell.pwd().split(separator);
  const actualDirectory = pathDirectoryList.pop();

  if (actualDirectory === "temp") {
    shell.rm("-rf", "*");
  }
}
