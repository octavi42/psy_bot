import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface AlertDialogDemoProps {
  buttonText: string
  title: string;
  description: string;
  buttonCancel?: string;
  buttonContinue: string;
}

export function AlertDialogComponent ({ buttonText, title, description, buttonCancel="Cancel", buttonContinue }: AlertDialogDemoProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{buttonText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-red-500 bg-red-500 text-slate-50 hover:text-red-500">{buttonCancel}</AlertDialogCancel>
          <AlertDialogAction className="text-slate-600 hover:text-slate-950">{buttonContinue}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
  </AlertDialog>
  )
}
