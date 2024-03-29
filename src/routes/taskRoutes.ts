import express, { Router } from 'express';
import {  claimTask, completeTaskById, getTaskDetailById, getTasksForUser, unclaimTask, getTaskComment, getHistoryOperation, getHistoricIdentityLink, getIdentityGroup, getTaskDetailByProcessInstance, updateTaskDetail, updateTaskDetailByTaskDefinitionKey, getTaskDataByTaskDefinitionKey, getHistoricalTaskDetails,  getProcessDefinitionXml, listTasksByCandidateGroup, getCompletedTaskDetails, userLogin ,userLogout, getMongoUser } from '../controller/taskController';
import { createTaskComment } from '../controller/taskController';
import { bpmnStartProcess, deployBpmnController, getAllRunningInstances, getProcessInstanceDetails, getTasks, getTasksProcessInstanceForUser } from '../controller/ProcessController';
import { addTaskForm, addTaskForm1, getTaskDetails, getTaskForm, getTaskForm1, getTaskRenderedFormById } from '../controller/formController';


const router = express.Router();

// form routes
router.get('/task/detail',getTaskDetails);
router.post('/add-task-form/:task_key/:task_id', addTaskForm);
router.post('/add-task-form1/:task_key/:task_id',addTaskForm1)
router.get('/task-detail1/:task_key/:task_id', getTaskForm);
router.get('/task-detail/:task_key/:task_id', getTaskForm1);
router.get('/task/rendered-form',getTaskRenderedFormById)

// process routes
router.post('/deploy',deployBpmnController);
router.post('/process/start',bpmnStartProcess);
router.get('/tasks/active',getTasks)
router.get('/process/variables', getProcessInstanceDetails);
router.get("/task/processinstance",getTasksProcessInstanceForUser );


// login route
router.post("/login",userLogin)
router.post("/logout",userLogout)
router.get("/getMongoUser",getMongoUser)

// task routes
router.get("/tasks",getTasksForUser);
router.get("/taskdetail",getTaskDetailByProcessInstance);
router.get("/update-json",)
// router.put("/updatetaskdetail",updateTaskDetail)
router.get('/update-task', updateTaskDetailByTaskDefinitionKey);
router.get('/gettaskdata',getTaskDataByTaskDefinitionKey)
// router.get("/update-tasks",updateTaskDetailByTaskInstanceId)


router.get("/task",getTaskDetailById)
router.get("/tasks/complete",getCompletedTaskDetails)
router.post("/task/complete",completeTaskById)
router.get('/tasks/candidate-group', listTasksByCandidateGroup);
router.post("/task/claim",claimTask)
router.post("/task/unclaim",unclaimTask)

router.post("/task/comment",createTaskComment)
router.get("/task/comment",getTaskComment)


// history routes
router.get("/history/tasks",getHistoricalTaskDetails)
router.get("/history/operation",getHistoryOperation)
router.get("/history/identity-link",getHistoricIdentityLink);

router.get("/diagram",getProcessDefinitionXml)


// identity routes
router.get("/identity/group",getIdentityGroup)
router.get("/process-instance",getAllRunningInstances)

export default router;