import { Loader2 } from "lucide-react"

const SendButtonStyle = () => {
    return (
        <div>
            <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-blue-500 rounded-full blur-md ease"></span>
            <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
            <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-blue-600 rounded-full blur-md"></span>
            <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-blue-800 rounded-full blur-md"></span>
            </span>
            <span className="relative text-white">Send</span>
        </div>
    )
}

const StopButtonStyle = () => {
    return (
        <div className="flex items-center">
            <Loader2 className="z-10 animate-spin mr-2 text-white" size={16} />
            <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
            <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
            <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-red-600 rounded-full blur-md"></span>
            <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-red-800 rounded-full blur-md"></span>
            </span>
            <span className="relative text-white">Stop</span>
        </div>
    )
}

export {SendButtonStyle, StopButtonStyle}