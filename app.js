const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let tasks = [];

// Route lấy danh sách tasks
app.get('/tasks', (req, res) => {
    res.json({ success: true, tasks });
});

// Route lấy thông tin task theo ID
app.get('/task/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (task) {
        res.json({ success: true, task });
    } else {
        res.status(404).json({ success: false, message: 'Task not found' });
    }
});

// Route thêm task vào db
app.post('/add', (req, res) => {
    const { task } = req.body;
    if (task) {
        tasks.push({ id: tasks.length + 1, task, status: 'todo' });
        res.json({ success: true, message: 'Task added successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Task is required' });
    }
});

// Route xoá task khỏi db
app.delete('/delete/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);

    // Cập nhật lại ID của các task còn lại
    tasks = tasks.map((task, index) => ({ ...task, id: index + 1 }));

    res.json({ success: true, message: 'Task deleted successfully' });
});

// Route cập nhật thông tin task
app.put('/update/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { task, status } = req.body;

    tasks = tasks.map(existingTask =>
        existingTask.id === taskId
            ? { ...existingTask, task: task || existingTask.task, status: status || existingTask.status }
            : existingTask
    );

    res.json({ success: true, message: 'Task updated successfully' });
});

// Route cập nhật status task thành done
app.put('/done/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.map(existingTask =>
        existingTask.id === taskId ? { ...existingTask, status: 'done' } : existingTask
    );

    res.json({ success: true, message: 'Task marked as done' });
});

// Lắng nghe cổng
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
