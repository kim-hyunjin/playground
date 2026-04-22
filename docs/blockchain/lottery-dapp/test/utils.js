async function shouldThrow(promise) {
    try {
        await promise;
        assert(true);
    } catch (err) {
        return;
    }
    assert(false, "The contract did not throw.");
}

async function expectEvent(logs, eventName) {
    const event = logs.find((log) => log.event === eventName);
    assert(event !== undefined);
}

module.exports = {
    shouldThrow,
    expectEvent,
};
