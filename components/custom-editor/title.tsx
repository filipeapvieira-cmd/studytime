import React from "react";

type TitleProps = {
  title: string;
};

export default function Title({ title }: Readonly<TitleProps>) {
  return (
    <h1 className="text-2xl border-b-2 p-2 font-semibold leading-none tracking-wide">
      {title}
    </h1>
  );
}
