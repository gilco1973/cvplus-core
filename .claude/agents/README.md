# CVPlus Core Module - Specialized Subagents

This directory contains references to specialized subagents for the CVPlus Core module.

## Primary Specialist

### core-module-specialist
**Location**: `/Users/gklainert/.local/share/claude-007-agents/.claude/agents/cvplus/core-module-specialist.md`

**Expertise**: 
- Foundation architecture and shared types
- Utility function design and implementation
- Cross-module integration patterns
- TypeScript type system excellence
- Configuration management
- Error handling frameworks

## Universal Specialists

### code-reviewer
**Location**: `/Users/gklainert/.local/share/claude-007-agents/.claude/agents/universal/code-reviewer.md`
**Usage**: Final review of all code changes

### debugger
**Location**: `/Users/gklainert/.local/share/claude-007-agents/.claude/agents/universal/debugger.md`
**Usage**: Complex troubleshooting and error resolution

### git-expert
**Location**: `/Users/gklainert/.local/share/claude-007-agents/.claude/agents/universal/git-expert.md`
**Usage**: All git operations and repository management

### test-writer-fixer
**Location**: `/Users/gklainert/.local/share/claude-007-agents/.claude/agents/universal/test-writer-fixer.md`
**Usage**: Comprehensive testing and test maintenance

## Engineering Specialists

### backend-test-engineer
**Location**: `/Users/gklainert/.local/share/claude-007-agents/.claude/agents/engineering/backend-test-engineer.md`
**Usage**: Backend-specific testing strategies

### typescript-pro
**Location**: `/Users/gklainert/.local/share/claude-007-agents/.claude/agents/engineering/typescript-pro.md`
**Usage**: Advanced TypeScript patterns and type safety

## Usage Pattern

When working on core module tasks:

1. **Primary coordination**: Always use `core-module-specialist` for domain-specific tasks
2. **Quality assurance**: Use `code-reviewer` for all code changes
3. **Git operations**: Use `git-expert` for all repository operations
4. **Testing**: Use `test-writer-fixer` and `backend-test-engineer` for comprehensive testing
5. **TypeScript issues**: Use `typescript-pro` for complex type problems
6. **Debugging**: Use `debugger` for complex troubleshooting

## Task Distribution

- **Architecture decisions**: `core-module-specialist` + `system-architect`
- **Type definitions**: `core-module-specialist` + `typescript-pro`
- **Utility functions**: `core-module-specialist` + `backend-architect`
- **Testing**: `test-writer-fixer` + `backend-test-engineer`
- **Build issues**: `core-module-specialist` + `debugger`