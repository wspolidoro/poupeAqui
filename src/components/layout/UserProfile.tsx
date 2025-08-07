
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { NavLink } from 'react-router-dom'

interface UserProfile {
  nome: string
  phone: string
  avatar_url?: string
}

export function UserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile for user:', user?.id)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('nome, phone, avatar_url')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar perfil:', error)
        throw error
      }
      
      console.log('Profile loaded:', data)
      setProfile(data)
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  if (!profile && user) {
    // Se não tem perfil mas tem usuário, criar um perfil básico
    return (
      <NavLink to="/perfil" className="block">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium truncate">{user.email}</p>
            <p className="text-xs text-muted-foreground truncate">Configurar perfil</p>
          </div>
        </div>
      </NavLink>
    )
  }

  if (!profile) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <NavLink to="/perfil" className="block">
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="bg-[#009600e6] text-primary-foreground">
            {getInitials(profile.nome)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
          <p className="text-sm font-medium truncate">{profile.nome}</p>
          <p className="text-xs text-muted-foreground truncate">{profile.phone}</p>
        </div>
      </div>
    </NavLink>
  )
}
