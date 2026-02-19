#!/usr/bin/env python3
"""Test script for HelloWorld contract on LocalNet"""

import algokit_utils
from smart_contracts.artifacts.hello_world.hello_world_client import (
    HelloWorldFactory,
    HelloArgs,
)


def test_hello_world():
    # Connect to LocalNet
    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer = algorand.account.from_environment("DEPLOYER")

    # Get or create the app factory
    factory = algorand.client.get_typed_app_factory(
        HelloWorldFactory, default_sender=deployer.address
    )

    # Deploy the app
    print("📦 Deploying HelloWorld contract...")
    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    )

    print(f"✅ Deployed! App ID: {app_client.app_id}")
    print(f"   App Address: {app_client.app_address}")

    # Test 1: Simple hello
    print("\n📝 Test 1: hello('Alice')")
    response = app_client.send.hello(args=HelloArgs(name="Alice"))
    print(f"   Response: {response.abi_return}")
    assert response.abi_return == "Hello, Alice", "Test failed!"
    print("   ✅ PASSED")

    # Test 2: Different name
    print("\n📝 Test 2: hello('Bob')")
    response = app_client.send.hello(args=HelloArgs(name="Bob"))
    print(f"   Response: {response.abi_return}")
    assert response.abi_return == "Hello, Bob", "Test failed!"
    print("   ✅ PASSED")

    # Test 3: Empty string
    print("\n📝 Test 3: hello('World')")
    response = app_client.send.hello(args=HelloArgs(name="World"))
    print(f"   Response: {response.abi_return}")
    assert response.abi_return == "Hello, World", "Test failed!"
    print("   ✅ PASSED")

    print("\n🎉 All tests passed!")


if __name__ == "__main__":
    test_hello_world()
