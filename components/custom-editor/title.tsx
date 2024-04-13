import React from "react";

type TitleProps = {
  title: string;
};

export default function Title({ title }: Readonly<TitleProps>) {
  return (
    <h1 className="text-3xl text-center rounded-md p-2 border-b-4 font-semibold leading-none tracking-wide">
      {title}
    </h1>
  );
}
