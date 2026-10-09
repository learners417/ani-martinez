import EstacionCliente from "./EstacionCliente";

export function generateStaticParams() {
  return ["1", "2", "3", "4", "5"].map((n) => ({ n }));
}

export default function Page() {
  return <EstacionCliente />;
}
