import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Column from './Column.tsx'
import ColumnAddButton from './ColumnAddButton.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <Column/>
    <Column/>
    <ColumnAddButton/>
  </>
)
