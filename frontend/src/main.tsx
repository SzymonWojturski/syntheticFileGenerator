import './index.css'
import { createRoot } from 'react-dom/client'
import GeneralForm from './GeneralForm.tsx'
import Column from './Column.tsx'
import ColumnAddButton from './ColumnAddButton.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <GeneralForm/>
    <Column/>
    <Column/>
    <ColumnAddButton/>
  </>
)
