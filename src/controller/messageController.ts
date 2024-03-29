import { Request, Response, NextFunction } from 'express';
import Messages from '../models/messageModel';

export const getMessages = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        createdAt: formatTimestamp(msg.createdAt),
      };
    });

    res.status(200).json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

const formatTimestamp = (timestamp: Date) => {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return timestamp.toLocaleDateString('en-US', options);
};


export const addMessage = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      res.json({ msg: 'Message added successfully.' });
    } else {
      res.json({ msg: 'Failed to add message to the database' });
    }
  } catch (ex) {
    next(ex);
  }
};
