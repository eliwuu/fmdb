import express, { Handler, Router } from 'express';
import { Logger } from 'winston';

abstract class AbtractController {
  constructor(
    private readonly router: Router,
    private readonly logger: Logger,
    private readonly basePath: string,
    private readonly handlers: Handler[]
  ) {
    this.router.use(this.basePath, this.router);
    this.router.use(handlers);
  }
}

export class BaseController extends AbtractController {
  constructor(
    router: Router,
    logger: Logger,
    basePath: string,
    handlers?: Handler[]
  ) {
    super(router, logger, basePath, [asyncWrapperHandler]);
  }
}

export class GenreController extends BaseController {
  constructor(router: Router, logger: Logger, basePath: string) {
    super(router, logger, basePath);
  }
}

export const asyncWrapperHandler: Handler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    await next();
  } catch (err) {
    res.status(500).send(err);
  }
};
