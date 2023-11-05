FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node .env ./

# Install production dependencies.
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# run node as non-root user for security reasons
USER node


# Production build
FROM node:18-alpine As build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
# Copy dependencies from development stage
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .
# Build production bundle
RUN npx prisma generate
RUN npm run build
ENV NODE_ENV production
# Ensure only production dependencies are installed
RUN npm ci --only=production && npm cache clean --force
USER node


# Production image
FROM node:18-alpine As production
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package*.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
CMD [ "npm", "run", "start:prod:migrate" ]
