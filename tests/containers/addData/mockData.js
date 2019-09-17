export const skipGuideProps = {
    setSkipGuide: jest.fn(),
    location: {},
    session: {
        skipGuide: true
    }
};

export const forceGuideProps = {
    setSkipGuide: jest.fn(),
    location: {
        query: {
            force: 'true'
        }
    },
    session: {
        skipGuide: false
    }
};

export const showGuideProps = {
    setSkipGuide: jest.fn(),
    location: {},
    session: {
        skipGuide: false
    }
};
