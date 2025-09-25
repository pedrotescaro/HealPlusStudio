"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  patientName: z.string().min(2, { message: "Nome do paciente é obrigatório." }),
  complaint: z.string().min(10, { message: "Queixa principal é obrigatória." }),
  history: z.string().min(10, { message: "História da doença atual é obrigatória." }),
})

export function AnamnesisForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      complaint: "",
      history: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
        title: "Anamnese Salva",
        description: `A anamnese do paciente ${values.patientName} foi salva com sucesso.`,
    })
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Paciente</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo do paciente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="complaint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Queixa Principal</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva a queixa principal do paciente"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="history"
          render={({ field }) => (
            <FormItem>
              <FormLabel>História da Doença Atual (HDA)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva a história da doença atual"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar Anamnese</Button>
      </form>
    </Form>
  )
}
