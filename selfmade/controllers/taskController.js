const express = require('express');

const Task = require('../models/Task.js');
const router  = express.Router();

const createTask= async(req, res)=>{
    try{
        const task = new Task(req.body);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch(err){
        res.status(500).json({error: err.message});
    }

}

const getAllTasks= async(req, res)=>{
    try{
        const tasks = await Task.find();
        res.status(200).json(tasks);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}


const getTaskById = async(req, res)=>{
    try{
        const task = await Task.findById(req.params.id);

        if(!task){
            return res.status(404).json({
                message: 'Task not found'
            })
        }
        res.status(200).json(task);
    } catch(err){
        res.status(500).json({error: err.message});
    }
}


const updateTaskById= async(req, res)=>{
    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({
            message: 'Task updated successfully',
            task: task
        });
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}


const deleteTaskById = async(req, res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task){
            return res.status(404).json({
                message: 'Task not found'
            });
        }
        res.status(200).json({
            message: 'Task deleted successfully',
            task: task
        });
    }
    catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById
};