import { MCPServer } from "@modelcontextprotocol/sdk";
import fs from "fs/promises";
import path from "path";

const projectRoot = path.resolve(process.cwd(), "..");

const server = new MCPServer("ReactConsoleMCP", "0.1.0");

server.method("listFiles", async (params) => {
  const dir = params?.dir || projectRoot;
  const files = await fs.readdir(dir, { withFileTypes: true });
  return files.map(f => ({
    name: f.name,
    type: f.isDirectory() ? "dir" : "file",
  }));
});

server.method("readFile", async (params) => {
  const filePath = path.join(projectRoot, params.path);
  const content = await fs.readFile(filePath, "utf-8");
  return { content };
});

server.method("writeFile", async (params) => {
  const filePath = path.join(projectRoot, params.path);
  await fs.writeFile(filePath, params.content, "utf-8");
  return { success: true };
});

server.start();
