import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardContent, Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Dashboard = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, title: 'Task 1', description: 'Description 1', status: 'todo', createdAt: '01/09/2024, 05:30:00' },
      { id: 2, title: 'Task 2', description: 'Description 2', status: 'todo', createdAt: '01/09/2021, 05:30:00' },
      { id: 3, title: 'Task 3', description: 'Description 3', status: 'todo', createdAt: '01/09/2024, 05:30:00' },
      { id: 4, title: 'Task 4', description: 'Description 4', status: 'in-progress', createdAt: '01/09/2024, 05:30:00' },
      { id: 5, title: 'Task 5', description: 'Description 5', status: 'in-progress', createdAt: '01/09/2021, 05:30:00' },
      { id: 6, title: 'Task 6', description: 'Description 6', status: 'done', createdAt: '01/09/2021, 05:30:00' },
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('createdAt'); // Default sorting by createdAt
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Sort tasks whenever sortOption or tasks change
    const sortedTasks = [...tasks].sort((a, b) => {
      if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortOption === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
    setTasks(sortedTasks);
  }, [sortOption]);

  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => setOpenAddDialog(false);
  const handleOpenEditDialog = (task) => {
    setCurrentTask(task);
    setNewTask({ ...task });
    setOpenEditDialog(true);
  };
  const handleCloseEditDialog = () => setOpenEditDialog(false);
  const handleOpenViewDialog = (task) => {
    setCurrentTask(task);
    setOpenViewDialog(true);
  };
  const handleCloseViewDialog = () => setOpenViewDialog(false);

  const handleAddTask = () => {
    const newId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    const newTaskWithId = { ...newTask, id: newId, createdAt: new Date().toLocaleString() };
    setTasks([...tasks, newTaskWithId]);
    setNewTask({ title: '', description: '', status: 'todo' });
    handleCloseAddDialog();
  };

  const handleEditTask = () => {
    setTasks(tasks.map(task => task.id === currentTask.id ? { ...task, ...newTask } : task));
    handleCloseEditDialog();
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTask = (task) => (
    <Card key={task.id} sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2">{task.description}</Typography>
        <Typography variant="caption">Created at: {task.createdAt}</Typography>
        <Box mt={2}>
          <Button startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
          <Button startIcon={<EditIcon />} color="primary" onClick={() => handleOpenEditDialog(task)}>Edit</Button>
          <Button startIcon={<VisibilityIcon />} color="secondary" onClick={() => handleOpenViewDialog(task)}>View Details</Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Paper elevation={10} sx={{ width: "60%", height: "auto", margin: "20px auto" }}>
      <Container>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleOpenAddDialog} sx={{ mt: 3 }}>Add Task</Button>
        </Box>
        <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
        <Box mt={2}>
          <Typography variant='h5'>Search</Typography>
          <TextField
            label="Search"
            variant="filled"
            sx={{ width: "200px", bgcolor: "white" }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>
        <Box mt={2}>
          <FormControl variant="filled" sx={{ width: "200px" }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="createdAt">Created Date</MenuItem>
              <MenuItem value="title">Title</MenuItem>
            </Select>
          </FormControl>
        </Box>
        </Box>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom>TODO</Typography>
              {filteredTasks.filter(task => task.status === 'todo').map(renderTask)}
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom>IN PROGRESS</Typography>
              {filteredTasks.filter(task => task.status === 'in-progress').map(renderTask)}
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom>DONE</Typography>
              {filteredTasks.filter(task => task.status === 'done').map(renderTask)}
            </Grid>
          </Grid>
        </Box>

        {/* Add Task Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent>
            <DialogContentText>Fill in the details for the new task.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Task Title"
              fullWidth
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Task Description"
              fullWidth
              multiline
              rows={4}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Task Status</InputLabel>
              <Select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                label="Task Status"
              >
                <MenuItem value="todo">TODO</MenuItem>
                <MenuItem value="in-progress">IN PROGRESS</MenuItem>
                <MenuItem value="done">DONE</MenuItem>
              </Select>
              <FormHelperText>Choose the status of the task from the dropdown.</FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} color="secondary">Cancel</Button>
            <Button onClick={handleAddTask} color="primary">Add Task</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <DialogContentText>Modify the details of the task.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Task Title"
              fullWidth
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Task Description"
              fullWidth
              multiline
              rows={4}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Task Status</InputLabel>
              <Select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                label="Task Status"
              >
                <MenuItem value="todo">TODO</MenuItem>
                <MenuItem value="in-progress">IN PROGRESS</MenuItem>
                <MenuItem value="done">DONE</MenuItem>
              </Select>
              <FormHelperText>Choose the status of the task from the dropdown.</FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="secondary">Cancel</Button>
            <Button onClick={handleEditTask} color="primary">Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* View Task Details Dialog */}
        <Dialog open={openViewDialog} onClose={handleCloseViewDialog}>
          <DialogTitle>Task Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Title: {currentTask?.title}
            </DialogContentText>
            <DialogContentText>
              Description: {currentTask?.description}
            </DialogContentText>
            <DialogContentText>
              Status: {currentTask?.status}
            </DialogContentText>
            <DialogContentText>
              Created At: {currentTask?.createdAt}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewDialog} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Paper>
  );
};

export default Dashboard;
