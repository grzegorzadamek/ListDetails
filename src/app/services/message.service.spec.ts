import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a message to messages array', () => {
    const testMessage = 'Test message';
    service.add(testMessage);
    expect(service.messages).toContain(testMessage);
    expect(service.messages.length).toBe(1);
  });

  it('should add multiple messages to messages array', () => {
    service.add('Message 1');
    service.add('Message 2');
    service.add('Message 3');
    expect(service.messages.length).toBe(3);
    expect(service.messages).toEqual(['Message 1', 'Message 2', 'Message 3']);
  });

  it('should clear all messages', () => {
    service.add('Message 1');
    service.add('Message 2');
    service.clear();
    expect(service.messages.length).toBe(0);
    expect(service.messages).toEqual([]);
  });
});
