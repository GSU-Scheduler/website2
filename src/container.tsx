export default function Container({ children }: Readonly<{ children: React.ReactNode }>) {
    return <div className="max-w-[1400px] 2xl:max-w-[1600px] bg-zinc-800 min-h-screen flex flex-col mx-auto">{children}</div>;
  }
