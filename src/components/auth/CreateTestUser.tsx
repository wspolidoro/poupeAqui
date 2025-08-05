
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, User } from 'lucide-react'

export function CreateTestUser() {
  const [creating, setCreating] = useState(false)

  const createTestUser = async () => {
    setCreating(true)
    try {
      // Criar usuário de teste
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: 'teste@financas.com',
        password: 'teste123456',
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (signUpError) throw signUpError

      if (authData.user) {
        // Criar perfil para o usuário de teste
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            nome: 'Usuário Teste',
            email: 'teste@financas.com',
            phone: '+5511999999999',
            ativo: true
          })

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
          // Não vamos falhar aqui, pois o usuário foi criado
        }

        // Criar algumas categorias de exemplo
        const categorias = [
          { nome: 'Alimentação', tags: 'comida,restaurante,mercado', userid: authData.user.id },
          { nome: 'Transporte', tags: 'combustível,uber,ônibus', userid: authData.user.id },
          { nome: 'Moradia', tags: 'aluguel,contas,casa', userid: authData.user.id },
          { nome: 'Saúde', tags: 'médico,farmácia,plano', userid: authData.user.id },
          { nome: 'Salário', tags: 'trabalho,renda,pagamento', userid: authData.user.id }
        ]

        const { error: categoriasError } = await supabase
          .from('categorias')
          .insert(categorias)

        if (categoriasError) {
          console.error('Erro ao criar categorias:', categoriasError)
        }

        toast({
          title: "Usuário de teste criado!",
          description: "Email: teste@financas.com | Senha: teste123456",
        })
      }
    } catch (error: any) {
      console.error('Erro ao criar usuário de teste:', error)
      toast({
        title: "Erro ao criar usuário de teste",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Criar Usuário de Teste
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Email:</strong> teste@financas.com</p>
            <p><strong>Senha:</strong> teste123456</p>
          </div>
          <Button 
            onClick={createTestUser} 
            disabled={creating}
            className="w-full"
          >
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando usuário...
              </>
            ) : (
              'Criar Usuário de Teste'
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            Este usuário será criado com dados de exemplo e algumas categorias pré-definidas.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
