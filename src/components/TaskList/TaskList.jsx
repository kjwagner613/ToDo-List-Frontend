import { Link } from "react-router";
import './TaskList.css'
const TaskList = (props) => {
  return (
    <div>
      <nav>
        </nav>
      <main><ul className="task-grid">

      {props.tasks.map((task) => (
        <Link key={task._id} to={`/tasks/${task._id}`}>
          <article>
            <header>
              <h2> <li class="task-item">{task.title}</li></h2>
              <p>
                <li class="task-item">{task.category || 'No Category'}</li>
                <li class="task-item">
                  {task.author.username} </li>
                <li class="task-item">posted on</li>
                <li class="task-item">{new Date(task.createdAt).toLocaleDateString()}</li>
              </p>
            </header>
          </article>
          </Link>
      ))}</ul>
      </main>
    </div>
  )
}

export default TaskList