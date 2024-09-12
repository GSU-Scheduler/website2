export default function Container({ children }: Readonly<{ children: React.ReactNode }>) {
    return <div className="max-w-[1400px] bg-zinc-800 min-h-screen flex flex-col mx-auto">{children}</div>;
  }
