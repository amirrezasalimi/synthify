import clsx from "clsx";

interface Props {
    name: string;
    src?: string;
    size?: "sm" | "md" | "lg";
}
const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-indigo-500", "bg-pink-500", "bg-purple-500", "bg-gray-500"]
const Avatar = ({ name, src, size = "sm" }: Props) => {
    const getIndex = () => {
        let sum = 0;
        for (let i = 0; i < name.length; i++) {
            sum += name.charCodeAt(i);
        }
        return sum % colors.length;
    }
    const sizesClass = {
        sm: "w-8 h-8",
        md: "w-16 h-16",
        lg: "w-24 h-24"
    }
    const textSizesClass = {
        sm: "text-sm",
        md: "text-md",
        lg: "text-lg"
    }
    return <div className="flex justify-center items-center">
        {
            src ? <img src={src} alt={name} className={
                clsx(
                    "rounded-full",
                    sizesClass[size]
                )
            } /> :
                <div className={clsx(
                    `rounded-full flex justify-center items-center text-white`,
                    colors[getIndex() % colors.length],
                    sizesClass[size]
                )}>
                    <span className={
                        clsx(
                            "text-white font-semibold capitalize",
                            textSizesClass[size]
                        )
                    }>{name[0]}</span>
                </div>
        }
    </div>
}

export default Avatar;