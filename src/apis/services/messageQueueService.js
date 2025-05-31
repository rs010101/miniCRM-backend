class MessageQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.batchSize = 50; // Process 50 updates at a time
    this.processInterval = 5000; // Process every 5 seconds
  }

  async enqueue(update) {
    this.queue.push(update);
    if (!this.processing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.queue.length === 0 || this.processing) {
      return;
    }

    this.processing = true;

    try {
      while (this.queue.length > 0) {
        // Get next batch
        const batch = this.queue.splice(0, this.batchSize);

        // Process batch
        await CommunicationLog.bulkWrite(
          batch.map(update => ({
            updateOne: {
              filter: { messageId: update.messageId },
              update: {
                $set: {
                  status: update.status,
                  updatedAt: new Date(),
                  ...(update.status === 'sent' && { sentAt: new Date() }),
                  ...(update.status === 'delivered' && { deliveredAt: new Date() }),
                  ...(update.status === 'failed' && { 
                    failedAt: new Date(),
                    error: update.metadata?.error 
                  }),
                  ...(update.metadata && { metadata: update.metadata })
                }
              }
            }
          }))
        );

        // Update campaign stats for affected campaigns
        const campaignIds = [...new Set(batch.map(update => update.campaignId))];
        await Promise.all(campaignIds.map(updateCampaignStats));

        // Wait before processing next batch
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Error processing message queue:', error);
    } finally {
      this.processing = false;
    }
  }

  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      isProcessing: this.processing,
      nextBatchSize: Math.min(this.queue.length, this.batchSize)
    };
  }

  async clearQueue() {
    this.queue = [];
    this.processing = false;
    return { success: true, message: 'Queue cleared' };
  }
}

export const messageQueue = new MessageQueue();