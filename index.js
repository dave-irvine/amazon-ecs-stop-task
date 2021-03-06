const core = require('@actions/core');
const aws = require('aws-sdk');

async function run() {
    try {
        const ecs = new aws.ECS({
            customUserAgent: 'amazon-ecs-stop-task-for-github-actions'
        });

        // Get inputs
        const task = core.getInput('task-arn', { required: true });
        const cluster = core.getInput('cluster', { required: false });
        const reason = core.getInput('reason', { required: false });

        try {
            const params = {
                task,
                cluster,
                reason
            };

            if (reason === "") {
                delete params.reason;
            }

            await ecs.stopTask(params).promise();
        } catch (error) {
            core.setFailed("Failed to stop task in ECS: " + error.message);
            throw (error);
        }
    }
    catch (error) {
        core.setFailed(error.message);
        core.debug(error.stack);
    }
}

module.exports = run;

/* istanbul ignore next */
if (require.main === module) {
    run();
}