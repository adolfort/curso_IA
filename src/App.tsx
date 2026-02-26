import { AppBar, Container, Toolbar, Typography } from '@mui/material';

function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestor de Tareas ICE
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bienvenido
        </Typography>
        <Typography variant="body1" color="textSecondary">
          App shell base. Próximamente: formulario de tareas, cálculo ICE y API Gemini.
        </Typography>
      </Container>
    </div>
  );
}

export default App;
