import { Link as RouterLink } from 'react-router-dom'
import { Drawer, List, ListItem, ListItemText } from '@material-ui/core'
import { useState } from 'react'

const drawerList = [
  { id: 1, label: 'Lab 1', route: '/lab1' },
  { id: 2, label: 'Lab 2', route: '/lab2' },
  { id: 3, label: 'Lab 3', route: '/lab3' },
  { id: 4, label: 'Lab 4', route: '/lab4' },
  { id: 5, label: 'Lab 5', route: '/lab5' },
]

const Navbar = () => {
  const [selected, setSelected] = useState(1)

  return (
    <Drawer variant='permanent'>
      <List component='nav' style={{ width: '160px' }}>
        {drawerList.map((el) => (
          <ListItem key={el.id} component={RouterLink} to={el.route} button onClick={() => setSelected(el.id)}>
            <ListItemText primary={el.label} selected={el.id === selected} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Navbar
