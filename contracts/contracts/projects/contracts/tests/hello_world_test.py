from algopy.testing import AlgorandTestClient, algopy_testing_context
from smart_contracts.hello_world.contract import HelloWorld


def test_hello_world():
    """Test the HelloWorld contract."""

    # Create a test client
    client = AlgorandTestClient()
    app_client = client.get_typed_app_client(HelloWorld)

    # Call the hello method
    result = app_client.hello(name="Alice")

    # Verify the result
    assert result.return_value == "Hello, Alice"


def test_hello_world_with_different_names():
    """Test the HelloWorld contract with different inputs."""

    client = AlgorandTestClient()
    app_client = client.get_typed_app_client(HelloWorld)

    # Test multiple names
    names = ["Bob", "Charlie", "Diana"]

    for name in names:
        result = app_client.hello(name=name)
        assert result.return_value == f"Hello, {name}"


if __name__ == "__main__":
    test_hello_world()
    test_hello_world_with_different_names()
    print("✅ All tests passed!")
