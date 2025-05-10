import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
// For the latest version of @testing-library/jest-dom
import '@testing-library/jest-dom'

// No need to extend matchers manually, it's done by the import above

// Clean up after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})