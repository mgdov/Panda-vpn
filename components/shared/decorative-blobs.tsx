export default function DecorativeBlobs() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Animated gradient blobs */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20"></div>
        </div>
    )
}
