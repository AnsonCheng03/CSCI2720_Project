"use client";
import { useRouter } from "next/compat/router";

export default function Page({ params }: { params: { id: string } }) {
  return <p>Post: {params.id}</p>;
}
