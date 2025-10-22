"""
Education System - Bureau-managed educational tutoring system with learning memory
See medical/medical_system.py for full implementation details.
"""

from uagents import Bureau
from tutor_agent import tutor_agent
from student_agent import student_agent
from learning_memory_agent import learning_memory_agent, memory_storage

bureau = Bureau(endpoint=["http://127.0.0.1:11000/submit"])
bureau.add(tutor_agent)
bureau.add(student_agent)
bureau.add(learning_memory_agent)

if __name__ == "__main__":
    print("\n" + "="*70)
    print("📚 EDUCATIONAL TUTORING SYSTEM WITH LEARNING MEMORY")
    print("="*70)
    print(f"👨‍🏫 Tutor Agent:   {tutor_agent.address}")
    print(f"👨‍🎓 Student Agent: {student_agent.address}")
    print(f"🧠 Memory Agent:   {learning_memory_agent.address}")
    print("="*70)
    print(f"💾 Loaded {len(memory_storage.memories)} student memories:")
    for mem in memory_storage.memories:
        print(f"   - [{mem['category']}] {mem['context']}")
    print("="*70)
    print()
    bureau.run()
