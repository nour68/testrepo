export default function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="border-2 border-lime border-t-transparent rounded-full animate-spin inline-block"
      style={{ width: size, height: size }}
    />
  )
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="font-heading text-4xl text-lime tracking-widest">RIADHA</h1>
        <LoadingSpinner size={32} />
      </div>
    </div>
  )
}
