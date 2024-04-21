import React from "react";

type TitleProps = {
  title: string;
};

export default function Title({ title }: Readonly<TitleProps>) {
  return (
    <h1 className="text-2xl p-2 font-semibold leading-none tracking-wide">
      {title}
    </h1>
  );
}
