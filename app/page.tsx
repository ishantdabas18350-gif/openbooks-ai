'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [q, setQ] = useState('')
  const [books, setBooks] = useState<any[]>([])
  const [summary, setSummary] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(res => setUser(res.data.user))
  }, [])

  const login = async () => {
    const email = prompt('Email')!
    const pass = prompt('Password')!
    await supabase.auth.signInWithPassword({ email, password: pass })
    location.reload()
  }

  const signup = async () => {
    const email = prompt('Email')!
    const pass = prompt('Password')!
    await supabase.auth.signUp({ email, password: pass })
    alert('Account created')
  }

  const logout = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  const search = async () => {
    const res = await fetch(`/api/books?q=${q}`)
    const data = await res.json()

    const merged = [
      ...(data.gut || []).map((b:any)=>({
        title: b.title,
        text: b.title,
      })),
      ...(data.google || []).map((b:any)=>({
        title: b.volumeInfo.title,
        text: b.volumeInfo.description || b.volumeInfo.title,
      }))
    ]

    setBooks(merged)
  }

  const getSummary = async (text:string) => {
    if (!user) return alert('Login required')

    const res = await fetch('/api/summary', {
      method: 'POST',
      body: JSON.stringify({ text })
    })

    const data = await res.json()
    setSummary(data.summary)
  }

  return (
    <div style={{padding:20,background:'#0b0f1a',color:'white',minHeight:'100vh'}}>
      <h1>📚 OpenBooks AI</h1>

      {!user ? (
        <>
          <button onClick={login}>Login</button>
          <button onClick={signup}>Signup</button>
        </>
      ) : (
        <button onClick={logout}>Logout</button>
      )}

      <input
        placeholder="Search books..."
        value={q}
        onChange={e=>setQ(e.target.value)}
        style={{display:'block',marginTop:10,padding:10}}
      />

      <button onClick={search} style={{marginTop:10}}>Search</button>

      <div style={{marginTop:20}}>
        {books.map((b,i)=>(
          <div key={i} style={{background:'#12182b',padding:10,marginBottom:10}}>
            <h3>{b.title}</h3>
            <button onClick={()=>getSummary(b.text)}>
              🤖 AI Summary
            </button>
          </div>
        ))}
      </div>

      {summary && (
        <div style={{marginTop:20,background:'#222',padding:10}}>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  )
    }
