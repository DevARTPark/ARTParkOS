// src/components/assessment/assessment_questions.ts

export interface AssessmentQuestion {
    id: string;
    text: string;
    options: {
        id: string;
        text: string;
        score: number; // 2.5 (Best), 1.75 (Second), 0.5 (Third), 0 (Worst)
    }[];
}

export interface AssessmentLap {
    id: string;
    title: string;
    description: string;
    questions: AssessmentQuestion[];
}

export const ASSESSMENT_LAPS: AssessmentLap[] = [
    // --- LAP 1: STRATEGY & LEADERSHIP (Q1-Q8) ---
    {
        id: 'lap1',
        title: 'Lap 1: Strategy & Leadership',
        description: 'Assessing how you handle uncertainty and strategic direction.',
        questions: [
            {
                id: 'q1',
                text: 'You are initiating a deep-tech project where requirements are unclear and resources are limited. What do you do first to move forward?',
                // Score: B > A > D > C
                options: [
                    { id: 'A', text: 'Clearly define what success would mean within the current technical and resource constraints.', score: 1.75 },
                    { id: 'B', text: 'Identify the single assumption that, if wrong, would most significantly affect all future decisions.', score: 2.5 },
                    { id: 'C', text: 'Build a small prototype or artefact to help the team align around a concrete starting point.', score: 0 },
                    { id: 'D', text: 'Have informal conversations with domain experts to validate whether the direction is reasonable.', score: 0.5 }
                ]
            },
            {
                id: 'q2',
                text: 'You discover that a technically promising direction partially conflicts with the stated mission of the initiative. How do you respond?',
                // Score: A > C > B > D
                options: [
                    { id: 'A', text: 'Narrow the technical direction so it fits within the current mission and stated goals.', score: 2.5 },
                    { id: 'B', text: 'Keep the direction in mind while continuing work on the originally planned path.', score: 0.5 },
                    { id: 'C', text: 'Reframe the technical direction by focusing on the underlying problem rather than the current framing.', score: 1.75 },
                    { id: 'D', text: 'Pause engagement with the direction until priorities or mandates change.', score: 0 }
                ]
            },
            {
                id: 'q3',
                text: 'Your team is starting work on a problem with high uncertainty and no obvious solution path. What do you emphasize when setting direction?',
                // Score: D > A > B > C
                options: [
                    { id: 'A', text: 'Establishing short-term milestones to provide structure and momentum.', score: 1.75 },
                    { id: 'B', text: 'Communicating a broad vision that helps the team understand long-term intent.', score: 0.5 },
                    { id: 'C', text: 'Suggesting a preferred technical approach based on past experience.', score: 0 },
                    { id: 'D', text: 'Clearly defining constraints, boundaries, and non-negotiable requirements.', score: 2.5 }
                ]
            },
            {
                id: 'q4',
                text: 'Midway through execution, you realize that a foundational assumption behind your strategy is incorrect. What is your immediate response?',
                // Score: B > D > A > C
                options: [
                    { id: 'A', text: 'Adjust how the team executes while keeping the overall direction intact.', score: 0.5 },
                    { id: 'B', text: 'Continue execution for now while collecting additional data to better understand the impact.', score: 2.5 },
                    { id: 'C', text: 'Temporarily pause major decisions until a clearer alternative emerges.', score: 0 },
                    { id: 'D', text: 'Revisit priorities and update the strategy to reflect the new understanding.', score: 1.75 }
                ]
            },
            {
                id: 'q5',
                text: 'You must choose between two possible paths: one is strongly aligned with the mission, while the other offers faster early traction. What do you do?',
                // Score: C > A > B > D
                options: [
                    { id: 'A', text: 'Choose the path that best aligns with the mission, even if progress is slower.', score: 1.75 },
                    { id: 'B', text: 'Choose the path that delivers faster traction and visible momentum.', score: 0.5 },
                    { id: 'C', text: 'Design a short, focused experiment to compare both paths before committing.', score: 2.5 },
                    { id: 'D', text: 'Seek advice from external stakeholders before making a decision.', score: 0 }
                ]
            },
            {
                id: 'q6',
                text: 'Your long-term vision is well defined, but near-term execution details remain uncertain. How do you handle planning?',
                // Score: A > B > D > C
                options: [
                    { id: 'A', text: 'Lock down short-term goals tightly to reduce ambiguity in execution.', score: 2.5 },
                    { id: 'B', text: 'Keep near-term plans flexible so they can evolve as learning increases.', score: 1.75 },
                    { id: 'C', text: 'Delegate planning decisions entirely to the team to encourage ownership.', score: 0 },
                    { id: 'D', text: 'Delay committing to near-term plans until more clarity emerges.', score: 0.5 }
                ]
            },
            {
                id: 'q7',
                text: 'Over time, you notice that what the team is executing is drifting away from the original strategy. How do you respond?',
                // Score: B > C > A > D
                options: [
                    { id: 'A', text: 'Bring execution back in line with the original strategy.', score: 0.5 },
                    { id: 'B', text: 'Adjust the strategy to reflect what is being learned through execution.', score: 2.5 },
                    { id: 'C', text: 'Allow the divergence to continue for a while to see where it leads.', score: 1.75 },
                    { id: 'D', text: 'Escalate the issue for a formal review and decision.', score: 0 }
                ]
            },
            {
                id: 'q8',
                text: 'You realize that key decisions are slowing down because leadership bandwidth is becoming a bottleneck. What do you do?',
                // Score: D > B > A > C
                options: [
                    { id: 'A', text: 'Reduce the scope of work to make decisions easier to manage.', score: 0.5 },
                    { id: 'B', text: 'Strengthen decision frameworks so more decisions can be made independently.', score: 1.75 },
                    { id: 'C', text: 'Add more people to distribute the workload.', score: 0 },
                    { id: 'D', text: 'Centralize decisions temporarily to regain control and speed.', score: 2.5 }
                ]
            }
        ]
    },

    // --- LAP 2: INNOVATION CULTURE (Q9-Q16) ---
    {
        id: 'lap2',
        title: 'Lap 2: Innovation Culture',
        description: 'Evaluating how your team collaborates and handles failure.',
        questions: [
            {
                id: 'q9',
                text: 'A teammate suggests an unconventional idea very late in the execution cycle, when most plans are already in motion. How do you respond?',
                // Score: C > A > D > B
                options: [
                    { id: 'A', text: 'Ask them to independently validate the idea further before it affects the current plan.', score: 1.75 },
                    { id: 'B', text: 'Run a small, low-risk test immediately to see if the idea has merit.', score: 0 },
                    { id: 'C', text: 'Acknowledge the idea and capture it formally for future consideration.', score: 2.5 },
                    { id: 'D', text: 'Discourage introducing changes at this stage to maintain execution focus.', score: 0.5 }
                ]
            },
            {
                id: 'q10',
                text: 'In teams that consistently produce strong innovation outcomes, how is disagreement typically handled?',
                // Score: B > D > A > C
                options: [
                    { id: 'A', text: 'Differences are minimized early to maintain alignment and momentum.', score: 0.5 },
                    { id: 'B', text: 'Disagreements are structured around evidence, reasoning, and shared criteria.', score: 2.5 },
                    { id: 'C', text: 'Disagreements arise informally and are resolved through discussion as needed.', score: 0 },
                    { id: 'D', text: 'Disagreements are consciously avoided in early stages to protect progress.', score: 1.75 }
                ]
            },
            {
                id: 'q11',
                text: 'An experiment fails and you notice that team morale is starting to drop. What do you do next?',
                // Score: D > B > A > C
                options: [
                    { id: 'A', text: 'Emphasize the specific lessons learned from the experiment.', score: 0.5 },
                    { id: 'B', text: 'Redirect attention toward quick, achievable wins to rebuild confidence.', score: 1.75 },
                    { id: 'C', text: 'Reduce the team\'s exposure to risky experiments for a while.', score: 0 },
                    { id: 'D', text: 'Reframe expectations by reinforcing that learning, not success, was the goal.', score: 2.5 }
                ]
            },
            {
                id: 'q12',
                text: 'Two competing ideas emerge within the team, and both have some merit. How do you decide what to pursue?',
                // Score: A > C > D > B
                options: [
                    { id: 'A', text: 'Have leadership make a clear decision to maintain focus and momentum.', score: 2.5 },
                    { id: 'B', text: 'Allow both ideas to be explored in parallel for some time.', score: 0 },
                    { id: 'C', text: 'Compare the ideas through small, time-bound experiments.', score: 1.75 },
                    { id: 'D', text: 'Choose the idea that feels more intuitively promising.', score: 0.5 }
                ]
            },
            {
                id: 'q13',
                text: 'You want to strengthen psychological safety within an innovation-focused team. What approach is most effective?',
                // Score: B > A > D > C
                options: [
                    { id: 'A', text: 'Avoid public criticism to prevent discomfort or defensiveness.', score: 1.75 },
                    { id: 'B', text: 'Encourage team members to explain their reasoning openly and transparently.', score: 2.5 },
                    { id: 'C', text: 'Reward successful outcomes to reinforce positive behavior.', score: 0 },
                    { id: 'D', text: 'Reduce individual decision ownership to lower perceived risk.', score: 0.5 }
                ]
            },
            {
                id: 'q14',
                text: 'In a well-functioning innovation culture, how is failure generally viewed?',
                // Score: C > D > B > A
                options: [
                    { id: 'A', text: 'Something that should be rare but tolerated when it happens.', score: 0 },
                    { id: 'B', text: 'Acceptable when there is strong justification behind it.', score: 0.5 },
                    { id: 'C', text: 'Intentionally designed into the process to enable learning.', score: 2.5 },
                    { id: 'D', text: 'Discussed openly to improve future decision-making.', score: 1.75 }
                ]
            },
            {
                id: 'q15',
                text: 'When teams are working on innovative projects, how should information ideally be shared?',
                // Score: A > C > B > D
                options: [
                    { id: 'A', text: 'Openly shared, but thoughtfully curated for relevance.', score: 2.5 },
                    { id: 'B', text: 'Fully transparent so everyone has access to everything.', score: 0.5 },
                    { id: 'C', text: 'Shared informally through ongoing conversations.', score: 1.75 },
                    { id: 'D', text: 'Centralized through formal channels and documentation.', score: 0 }
                ]
            },
            {
                id: 'q16',
                text: 'Collaboration within the team starts slowing down decision-making. How do you address this?',
                // Score: D > B > C > A
                options: [
                    { id: 'A', text: 'Accept slower progress as the cost of collaboration.', score: 0 },
                    { id: 'B', text: 'Reduce the number of people involved in decisions.', score: 1.75 },
                    { id: 'C', text: 'Introduce clearer roles and responsibilities.', score: 0.5 },
                    { id: 'D', text: 'Introduce explicit decision rules to speed up outcomes.', score: 2.5 }
                ]
            }
        ]
    },

    // --- LAP 3: OPERATIONS (Q17-Q24) ---
    {
        id: 'lap3',
        title: 'Lap 3: Organizational Operations',
        description: 'Assessing operational efficiency and execution.',
        questions: [
            {
                id: 'q17',
                text: 'You are starting work on a novel system where requirements and workflows are still evolving. How do you approach process initially?',
                // Score: B > A > C > D
                options: [
                    { id: 'A', text: 'Begin with informal coordination and introduce structure gradually as patterns emerge.', score: 1.75 },
                    { id: 'B', text: 'Define a lightweight process upfront and adapt it continuously as learning increases.', score: 2.5 },
                    { id: 'C', text: 'Avoid introducing any process early to preserve maximum flexibility.', score: 0.5 },
                    { id: 'D', text: 'Adopt an existing, well-defined process to reduce ambiguity from the start.', score: 0 }
                ]
            },
            {
                id: 'q18',
                text: 'Despite sustained effort, progress on a project keeps stalling without clear technical failures. What do you do next?',
                // Score: C > B > A > D
                options: [
                    { id: 'A', text: 'Increase discipline by tightening execution and accountability.', score: 0.5 },
                    { id: 'B', text: 'Reduce scope to make progress more achievable.', score: 1.75 },
                    { id: 'C', text: 'Re-examine the underlying assumptions that are driving current decisions.', score: 2.5 },
                    { id: 'D', text: 'Extend timelines to allow more time for execution.', score: 0 }
                ]
            },
            {
                id: 'q19',
                text: 'You notice that work is frequently being redone or revised during delivery. How do you respond?',
                // Score: A > C > B > D
                options: [
                    { id: 'A', text: 'Improve documentation so expectations and decisions are clearer.', score: 2.5 },
                    { id: 'B', text: 'Accept some rework as a natural part of exploratory development.', score: 0.5 },
                    { id: 'C', text: 'Identify deeper systemic causes that are leading to repeated rework.', score: 1.75 },
                    { id: 'D', text: 'Clarify ownership and interfaces between different contributors.', score: 0 }
                ]
            },
            {
                id: 'q20',
                text: 'When evaluating progress in an early-stage initiative, which type of operational signal do you value most?',
                // Score: D > C > A > B
                options: [
                    { id: 'A', text: 'The volume of outputs being produced.', score: 0.5 },
                    { id: 'B', text: 'How efficiently costs are being controlled.', score: 0 },
                    { id: 'C', text: 'The speed at which work is moving forward.', score: 1.75 },
                    { id: 'D', text: 'The amount of learning achieved relative to key risks.', score: 2.5 }
                ]
            },
            {
                id: 'q21',
                text: 'Progress is slowing because multiple components depend heavily on each other. What do you do?',
                // Score: A > D > C > B
                options: [
                    { id: 'A', text: 'Decouple components so work can proceed more independently.', score: 2.5 },
                    { id: 'B', text: 'Push harder on dependent teams or systems to move faster.', score: 0 },
                    { id: 'C', text: 'Add more coordination layers to manage dependencies better.', score: 0.5 },
                    { id: 'D', text: 'Work around the dependencies temporarily to keep momentum.', score: 1.75 }
                ]
            },
            {
                id: 'q22',
                text: 'You need to decide whether to prioritize speed or robustness in an early implementation. How do you choose?',
                // Score: C > A > B > D
                options: [
                    { id: 'A', text: 'Bias toward robustness to reduce future failures.', score: 1.75 },
                    { id: 'B', text: 'Bias toward speed to gain early momentum.', score: 0.5 },
                    { id: 'C', text: 'Choose based on the level of risk exposure and potential impact.', score: 2.5 },
                    { id: 'D', text: 'Defer the decision until more usage data is available.', score: 0 }
                ]
            },
            {
                id: 'q23',
                text: 'As the system evolves, operational complexity starts increasing rapidly. What is your response?',
                // Score: B > D > A > C
                options: [
                    { id: 'A', text: 'Simplify the scope to reduce moving parts.', score: 0.5 },
                    { id: 'B', text: 'Add tooling to better manage and automate complexity.', score: 2.5 },
                    { id: 'C', text: 'Add more people to distribute the workload.', score: 0 },
                    { id: 'D', text: 'Redesign the underlying architecture to handle complexity more cleanly.', score: 1.75 }
                ]
            },
            {
                id: 'q24',
                text: 'You notice that frequent experimentation is beginning to slow down delivery timelines. How do you address this?',
                // Score: D > B > C > A
                options: [
                    { id: 'A', text: 'Limit the number of experiments to protect execution speed.', score: 0 },
                    { id: 'B', text: 'Accept slower execution as the cost of experimentation.', score: 1.75 },
                    { id: 'C', text: 'Separate experimentation work from delivery work.', score: 0.5 },
                    { id: 'D', text: 'Time-box experiments so learning happens without derailing execution.', score: 2.5 }
                ]
            }
        ]
    },

    // --- LAP 4: INDIVIDUAL MINDSET (Q25-Q32) ---
    {
        id: 'lap4',
        title: 'Lap 4: Individual Mindset',
        description: 'Understanding your personal approach to problem solving.',
        questions: [
            {
                id: 'q25',
                text: 'You are asked to contribute to a project in a technical domain that is unfamiliar to you. How do you approach this situation?',
                // Score: A > D > B > C
                options: [
                    { id: 'A', text: 'Learn enough about the domain to understand key trade-offs and make informed decisions.', score: 2.5 },
                    { id: 'B', text: 'Limit your involvement to avoid making incorrect technical judgments.', score: 0.5 },
                    { id: 'C', text: 'Rely primarily on domain experts to guide decisions without engaging deeply yourself.', score: 0 },
                    { id: 'D', text: 'Take full ownership of the domain and learn everything required along the way.', score: 1.75 }
                ]
            },
            {
                id: 'q26',
                text: 'A system you helped design fails in an unexpected way during testing or deployment. What do you do first?',
                // Score: B > A > C > D
                options: [
                    { id: 'A', text: 'Make targeted parameter changes to see if performance improves.', score: 1.75 },
                    { id: 'B', text: 'Revisit the assumptions that informed the original design decisions.', score: 2.5 },
                    { id: 'C', text: 'Compare the behavior with similar systems to identify patterns.', score: 0.5 },
                    { id: 'D', text: 'Shift attention temporarily to another task while the issue is investigated.', score: 0 }
                ]
            },
            {
                id: 'q27',
                text: 'You are working on a problem where goals and constraints are not clearly defined. How do you typically respond?',
                // Score: C > A > D > B
                options: [
                    { id: 'A', text: 'Look for structure as early as possible to reduce uncertainty.', score: 1.75 },
                    { id: 'B', text: 'Remain curious and adapt continuously as new information emerges.', score: 0 },
                    { id: 'C', text: 'Narrow your focus to a small, controllable part of the problem.', score: 2.5 },
                    { id: 'D', text: 'Explore different possibilities cautiously while avoiding strong commitments.', score: 0.5 }
                ]
            },
            {
                id: 'q28',
                text: 'You receive feedback that directly challenges your current approach to a problem. How do you respond?',
                // Score: D > B > A > C
                options: [
                    { id: 'A', text: 'Defend your reasoning until there is strong evidence against it.', score: 0.5 },
                    { id: 'B', text: 'Test the feedback through a small, controlled experiment.', score: 1.75 },
                    { id: 'C', text: 'Change direction immediately to align with the feedback.', score: 0 },
                    { id: 'D', text: 'Examine the assumptions behind both your approach and the feedback.', score: 2.5 }
                ]
            },
            {
                id: 'q29',
                text: 'Progress on your work has slowed significantly despite sustained effort. What do you do next?',
                // Score: B > C > D > A
                options: [
                    { id: 'A', text: 'Increase effort and intensity to push through the slowdown.', score: 0 },
                    { id: 'B', text: 'Re-prioritize tasks to focus on what matters most right now.', score: 2.5 },
                    { id: 'C', text: 'Seek external input to gain new perspectives or unblock progress.', score: 1.75 },
                    { id: 'D', text: 'Reflect internally on your approach before making changes.', score: 0.5 }
                ]
            },
            {
                id: 'q30',
                text: 'When things do not go as planned, how do you primarily take responsibility for the outcome?',
                // Score: A > C > B > D
                options: [
                    { id: 'A', text: 'By owning the decisions that led to the outcome.', score: 2.5 },
                    { id: 'B', text: 'By owning the planning process that shaped the work.', score: 0.5 },
                    { id: 'C', text: 'By owning the learning gained from what worked and what didn\'t.', score: 1.75 },
                    { id: 'D', text: 'By owning the execution details of the task.', score: 0 }
                ]
            },
            {
                id: 'q31',
                text: 'You tend to be most effective in situations where:',
                // Score: D > B > C > A
                options: [
                    { id: 'A', text: 'The conditions and expectations are clearly defined upfront.', score: 0 },
                    { id: 'B', text: 'Constraints can change as learning evolves.', score: 1.75 },
                    { id: 'C', text: 'Goals are clearly stated even if methods are flexible.', score: 0.5 },
                    { id: 'D', text: 'Direction gradually emerges through exploration and iteration.', score: 2.5 }
                ]
            },
            {
                id: 'q32',
                text: 'After experiencing a failure in your work, how does it most commonly affect your motivation?',
                // Score: C > D > A > B
                options: [
                    { id: 'A', text: 'It temporarily reduces your confidence.', score: 0.5 },
                    { id: 'B', text: 'It makes you more cautious in subsequent decisions.', score: 0 },
                    { id: 'C', text: 'It prompts reflection that improves how you approach future work.', score: 2.5 },
                    { id: 'D', text: 'It increases your determination to improve and try again.', score: 1.75 }
                ]
            }
        ]
    },

    // --- LAP 5: TACTICAL MEASURES (Q33-Q40) ---
    {
        id: 'lap5',
        title: 'Lap 5: Tactical Measures',
        description: 'Measuring how you track progress and validate results.',
        questions: [
            {
                id: 'q33',
                text: 'You are short on time and have multiple tasks competing for attention. How do you decide what to work on first?',
                // Score: B > A > C > D
                options: [
                    { id: 'A', text: 'Focus on tasks that remove blockers for other people.', score: 1.75 },
                    { id: 'B', text: 'Focus on tasks that reduce the largest unknowns or uncertainties.', score: 2.5 },
                    { id: 'C', text: 'Focus on tasks that show visible progress quickly.', score: 0.5 },
                    { id: 'D', text: 'Focus on tasks that are most closely aligned with stated plans or goals.', score: 0 }
                ]
            },
            {
                id: 'q34',
                text: 'A technical shortcut allows you to move faster now but introduces risk later. How do you handle this decision?',
                // Score: D > C > A > B
                options: [
                    { id: 'A', text: 'Use the shortcut temporarily to maintain momentum.', score: 0.5 },
                    { id: 'B', text: 'Avoid the shortcut to prevent future complications.', score: 0 },
                    { id: 'C', text: 'Use the shortcut with a clear rollback or mitigation plan.', score: 1.75 },
                    { id: 'D', text: 'Escalate the decision to reach a shared agreement before proceeding.', score: 2.5 }
                ]
            },
            {
                id: 'q35',
                text: 'You need to make a trade-off between improving performance and improving reliability in a system. What guides your decision?',
                // Score: A > B > D > C
                options: [
                    { id: 'A', text: 'Optimize the trade-off based on the specific deployment and usage context.', score: 2.5 },
                    { id: 'B', text: 'Prefer reliability to avoid downstream failures.', score: 1.75 },
                    { id: 'C', text: 'Improve performance cautiously without compromising stability too much.', score: 0 },
                    { id: 'D', text: 'Delay the decision until more real-world data becomes available.', score: 0.5 }
                ]
            },
            {
                id: 'q36',
                text: 'Resources become more constrained than expected midway through a project. What do you do?',
                // Score: C > D > B > A
                options: [
                    { id: 'A', text: 'Lower the overall ambition of the work.', score: 0 },
                    { id: 'B', text: 'Reduce the scope to fit available resources.', score: 0.5 },
                    { id: 'C', text: 'Improve efficiency to get more output from existing resources.', score: 2.5 },
                    { id: 'D', text: 'Redesign the approach to change how resources are used.', score: 1.75 }
                ]
            },
            {
                id: 'q37',
                text: 'You are considering a task that requires significant effort, but its value is not clearly defined. How do you proceed?',
                // Score: B > C > A > D
                options: [
                    { id: 'A', text: 'Defer the task until its value becomes clearer.', score: 0.5 },
                    { id: 'B', text: 'Break the task down to better understand its components and effort.', score: 2.5 },
                    { id: 'C', text: 'Clarify what learning or insight the task is expected to produce.', score: 1.75 },
                    { id: 'D', text: 'Drop the task entirely due to the uncertainty.', score: 0 }
                ]
            },
            {
                id: 'q38',
                text: 'You notice that ongoing work is slowly drifting away from the original objectives. How do you respond?',
                // Score: A > D > B > C
                options: [
                    { id: 'A', text: 'Tighten tracking to better monitor alignment with objectives.', score: 2.5 },
                    { id: 'B', text: 'Realign priorities to reflect what the team is currently doing.', score: 0.5 },
                    { id: 'C', text: 'Increase oversight to ensure closer control.', score: 0 },
                    { id: 'D', text: 'Re-communicate the original intent and desired outcomes.', score: 1.75 }
                ]
            },
            {
                id: 'q39',
                text: 'Early signs of traction are weak, but the team is learning valuable things quickly. What do you do?',
                // Score: D > A > C > B
                options: [
                    { id: 'A', text: 'Seek external validation to confirm whether the learning is meaningful.', score: 1.75 },
                    { id: 'B', text: 'Pause execution to reassess the situation more thoroughly.', score: 0 },
                    { id: 'C', text: 'Continue iterating on the current approach to improve results.', score: 0.5 },
                    { id: 'D', text: 'Pivot the direction based on what the learning is indicating.', score: 2.5 }
                ]
            },
            {
                id: 'q40',
                text: 'At an early stage, how do you primarily judge whether an initiative has been successful?',
                // Score: C > B > A > D
                options: [
                    { id: 'A', text: 'Whether tangible outputs have been delivered.', score: 0.5 },
                    { id: 'B', text: 'Whether additional funding or resources have been secured.', score: 1.75 },
                    { id: 'C', text: 'Whether key stakeholders have confidence in the direction.', score: 2.5 },
                    { id: 'D', text: 'Whether major risks and uncertainties have been reduced.', score: 0 }
                ]
            }
        ]
    }
];