import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import OLDQuestion from "./QuestionMultiple";

configure({adapter: new Adapter()});

describe('<QuestionMultiple />', ()=>{
    let wrapper;
    beforeEach(()=>{
        wrapper = shallow(<OLDQuestion answers={[
                    {
                        id: 0,
                        text: 'risposta1',
                        correct: true
                    },
                    {
                        id: 1,
                        text: 'risposta2'
                    },
                    {
                        id: 2,
                        text: 'risposta3'
                    }
            ]}/>);
    });

    it('QuestionMultiple should have only one h1', ()=>{
        expect(wrapper.find('h1')).toHaveLength(1);
    })

    it('QuestionMultiple should have three answers', ()=>{
        expect(wrapper.find('li')).toHaveLength(3);
    })

    it('QuestionMultiple should have two answers', ()=>{
        wrapper.setProps({answers: [
                {
                    id: 0,
                    text: 'risposta1',
                    correct: true
                },
                {
                    id: 1,
                    text: 'risposta2'
                }
            ]});
        expect(wrapper.find('li')).toHaveLength(2);
    })

})