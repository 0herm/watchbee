import { SquareCheckBig } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function WatchTool() {
    return (
        <Dialog>
        <DialogTrigger asChild>
            <Button variant="secondary" className="w-[2.5rem] h-[2.5rem]">
                <SquareCheckBig className='stroke-white p-[0.3rem] size-full w-[2rem] h-[2rem]' />
            </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Watchlist</DialogTitle>
                <DialogDescription>
                    Edit the watchlists
                </DialogDescription>
            </DialogHeader>
            <div>
                <p>To be added</p>
            </div>
            <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                    Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    )
}
