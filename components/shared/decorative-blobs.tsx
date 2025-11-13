export default function DecorativeBlobs() {
    return (
        <>
            <div className="pointer-events-none fixed -top-32 -left-32 w-[500px] h-[500px] bg-green-700/20 rounded-full blur-3xl opacity-50 z-0 animate-pulse" />
            <div className="pointer-events-none fixed top-1/2 right-0 w-[300px] h-[300px] bg-green-500/10 rounded-full blur-3xl opacity-40 z-0" />
            <div className="pointer-events-none fixed bottom-0 left-1/3 w-[400px] h-[400px] bg-green-400/10 rounded-full blur-2xl opacity-30 z-0" />
        </>
    )
}
