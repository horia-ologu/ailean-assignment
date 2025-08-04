import { Agent, CreateAgentRequest } from '../services/api'
import CreateAgentForm from './CreateAgentForm'
import AgentList from './AgentList'

interface AgentManagementProps {
	agents: Agent[]
	isHotelBot: (agent: Agent) => boolean
	showCreateForm: boolean
	setShowCreateForm: (show: boolean) => void
	onCreateAgent: (data: CreateAgentRequest) => Promise<void>
	onAgentClick: (agent: Agent) => void
	onDeleteClick: (agent: Agent) => void
	isCreating: boolean
}

export default function AgentManagement({
	agents,
	isHotelBot,
	showCreateForm,
	setShowCreateForm,
	onCreateAgent,
	onAgentClick,
	onDeleteClick,
	isCreating,
}: AgentManagementProps) {
	return (
		<div className='bg-white rounded-lg shadow-md p-6'>
			<h2 className='text-2xl font-semibold text-gray-800 mb-6'>
				Agent Management
			</h2>

			{/* Create Agent Form Accordion */}
			<CreateAgentForm
				showCreateForm={showCreateForm}
				setShowCreateForm={setShowCreateForm}
				onCreateAgent={onCreateAgent}
				isCreating={isCreating}
			/>

			{/* Agents List */}
			<div>
				<h3 className='text-lg font-medium text-gray-800 mb-4'>
					Current Agents
				</h3>
				<AgentList
					agents={agents}
					isHotelBot={isHotelBot}
					onAgentClick={onAgentClick}
					onDeleteClick={onDeleteClick}
				/>
			</div>
		</div>
	)
}
