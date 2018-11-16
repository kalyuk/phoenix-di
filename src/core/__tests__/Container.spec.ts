import * as assert from 'assert';
import { Container } from '../Container';
import { Component } from '../../annotation/Component';
import { Inject } from '../../annotation/Inject';
import { onInit } from '../../annotation/onInit';

@Component('TestComponent')
class TestComponent {

    @Inject('TestRepository')
    public testRepository: TestRepository;
}

@Component('TestService')
class TestService {

    @Inject('TestComponent')
    public testComponent: TestComponent;
    
}

@Component('TestRepository')
class TestRepository {

    @Inject('TestService')
    public testService: TestService;

    @onInit()
    public run(){
        console.log('test')
    }
}

describe('Container', () => {
    it('Shoul be create different containers', () => {
        const core = Container.getContainer('core');
        const test = Container.getContainer('test');

        assert.notEqual(core, test);

        Container.remove('core');
        Container.remove('test');
    });
 
    it('Shoul be register component', () => {
        const core = Container.getContainer('core');
        
        const testComponent = core.get('TestComponent')

        assert(testComponent instanceof TestComponent);
        Container.remove('core');
    })

    it('Shoul be inject depens', () => {
        const core = Container.getContainer('core'); 
        const testService: TestService = core.get('TestService');
        assert(testService.testComponent instanceof TestComponent);

        Container.remove('core');
    })

    it('Shoul be inject depens recursive', () => {
        const core = Container.getContainer('core'); 
        const testService: TestService = core.get('TestService');
        assert(testService.testComponent.testRepository instanceof TestRepository);

        Container.remove('core');
    })

    it('Shoul be inject cicle deps', () => {
        const core = Container.getContainer('core'); 
        const testService: TestService = core.get('TestService');
        assert(testService.testComponent.testRepository.testService instanceof TestService);

        Container.remove('core');
    })
});